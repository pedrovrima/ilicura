-- Ensure UUID generator once (safe to re-run)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Trigger function
CREATE OR REPLACE FUNCTION ilicura_audit_write() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_author_id       int  := nullif(current_setting('app.author_id', true), '')::int;
  v_data_source_id  int  := nullif(current_setting('app.data_source_id', true), '')::int;

  v_row_uid         uuid;
  v_pk              jsonb;
  v_old             jsonb;
  v_new             jsonb;
  v_changed_cols    text[];

  v_subject_table   text;
  v_subject_row_uid uuid;

  v_species_id      int;
  v_molt_id         int;
  v_pic_id          int;
  v_sex_info_id     int;
BEGIN
  IF TG_TABLE_NAME = 'ilicura_audit_log' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF TG_OP <> 'DELETE' THEN v_new := to_jsonb(NEW); END IF;
  IF TG_OP <> 'INSERT' THEN v_old := to_jsonb(OLD); END IF;

  IF TG_OP = 'INSERT' THEN
    v_row_uid := COALESCE(NEW.row_uid, gen_random_uuid());
    NEW.row_uid := v_row_uid;
    v_pk := jsonb_build_object('id', NEW.id);
  ELSIF TG_OP = 'UPDATE' THEN
    v_row_uid := COALESCE(NEW.row_uid, OLD.row_uid, gen_random_uuid());
    NEW.row_uid := v_row_uid;
    v_pk := jsonb_build_object('id', NEW.id);
  ELSE
    v_row_uid := OLD.row_uid;
    v_pk := jsonb_build_object('id', OLD.id);
  END IF;

  -- default subject: the row itself
  v_subject_table := TG_TABLE_NAME;
  v_subject_row_uid := v_row_uid;

  -- species subject resolution
  IF TG_TABLE_NAME = 'ilicura_species' THEN
    v_subject_table := 'ilicura_species';
    v_subject_row_uid := v_row_uid;

  ELSIF TG_TABLE_NAME IN (
    'ilicura_species_info',
    'ilicura_species_initial_description',
    'ilicura_species_featured_picture',
    'ilicura_cemave_band_size',
    'ilicura_humming_bird_band_circumference',
    'ilicura_humming_bird_bill_corrugation',
    'ilicura_molt_strategy',
    'ilicura_species_molt_extensions',
    'ilicura_skull',
    'ilicura_total_captures_by_species'
  ) THEN
    v_species_id := COALESCE((v_new->>'species_id')::int, (v_old->>'species_id')::int);
    IF v_species_id IS NOT NULL THEN
      SELECT row_uid INTO v_subject_row_uid FROM ilicura_species WHERE id = v_species_id;
      IF v_subject_row_uid IS NOT NULL THEN v_subject_table := 'ilicura_species'; END IF;
    END IF;

  ELSIF TG_TABLE_NAME = 'ilicura_molt_limits' THEN
    v_molt_id := COALESCE((v_new->>'molt_id')::int, (v_old->>'molt_id')::int);
    IF v_molt_id IS NOT NULL THEN
      SELECT s.row_uid
        INTO v_subject_row_uid
      FROM ilicura_species_molt_extensions sme
      JOIN ilicura_species s ON s.id = sme.species_id
      WHERE sme.id = v_molt_id;
      IF v_subject_row_uid IS NOT NULL THEN v_subject_table := 'ilicura_species'; END IF;
    END IF;

  ELSIF TG_TABLE_NAME = 'ilicura_species_picture' THEN
    -- NOTE: column is "sexInfoId" (camelCase)
    v_sex_info_id := COALESCE((v_new->>'sexInfoId')::int, (v_old->>'sexInfoId')::int);
    IF v_sex_info_id IS NOT NULL THEN
      SELECT s.row_uid
        INTO v_subject_row_uid
      FROM ilicura_specues_sex_info ssi
      JOIN ilicura_species_age_info sai ON sai.id = ssi.age_id
      JOIN ilicura_species s ON s.id = sai.species_id
      WHERE ssi.id = v_sex_info_id;
      IF v_subject_row_uid IS NOT NULL THEN v_subject_table := 'ilicura_species'; END IF;
    END IF;

  ELSIF TG_TABLE_NAME = 'ilicura_pictures_tags' THEN
    v_pic_id := COALESCE((v_new->>'picture_id')::int, (v_old->>'picture_id')::int);
    IF v_pic_id IS NOT NULL THEN
      SELECT s.row_uid
        INTO v_subject_row_uid
      FROM ilicura_species_picture sp
      JOIN ilicura_specues_sex_info ssi ON ssi.id = sp."sexInfoId"
      JOIN ilicura_species_age_info sai ON sai.id = ssi.age_id
      JOIN ilicura_species s ON s.id = sai.species_id
      WHERE sp.id = v_pic_id;
      IF v_subject_row_uid IS NOT NULL THEN v_subject_table := 'ilicura_species'; END IF;
    END IF;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_changed_cols := ARRAY(
      SELECT key
      FROM jsonb_object_keys(v_new) AS key
      WHERE v_new->key IS DISTINCT FROM v_old->key
        AND key NOT IN ('row_uid','updatedAt','created_at')
    );
    IF v_changed_cols IS NULL OR cardinality(v_changed_cols) = 0 THEN
      RETURN NEW;
    END IF;
  END IF;

  INSERT INTO ilicura_audit_log(
    occurred_at, txid, table_schema, table_name, row_uid, pk, op,
    old_data, new_data, changed_cols, author_id, data_source_id,
    subject_table, subject_row_uid
  ) VALUES (
    now(), txid_current(), TG_TABLE_SCHEMA, TG_TABLE_NAME, v_row_uid, v_pk, TG_OP::text,
    v_old, v_new, v_changed_cols, v_author_id, v_data_source_id,
    v_subject_table, v_subject_row_uid
  );

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

-- 2) Attach triggers (only tables you added row_uid to)
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'ilicura_species',
    'ilicura_species_info',
    'ilicura_species_initial_description',
    'ilicura_species_featured_picture',
    'ilicura_species_picture',
    'ilicura_pictures_tags',
    'ilicura_cemave_band_size',
    'ilicura_humming_bird_band_circumference',
    'ilicura_humming_bird_bill_corrugation',
    'ilicura_molt_strategy',
    'ilicura_species_molt_extensions',
    'ilicura_molt_limits',
    'ilicura_skull',
    'ilicura_total_captures_by_species',
    'ilicura_species_age_info',
    'ilicura_specues_sex_info'
  ]::text[])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS audit_%I ON %I;', t, t);
    EXECUTE format(
      'CREATE TRIGGER audit_%1$I
         BEFORE INSERT OR UPDATE OR DELETE ON %1$I
         FOR EACH ROW
         EXECUTE FUNCTION ilicura_audit_write();',
      t
    );
  END LOOP;
END$$;
