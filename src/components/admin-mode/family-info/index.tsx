import { api } from "@/trpc/react";
import UpdateFamilyDescription from "./update-family-description";
import UpdateFamilyFeathers from "./update-family-feathers";

const FamilyInfo = ({ speciesId }: { speciesId: number }) => {
  const familyInfo = api.speciesInfo.getFamilyInfo.useQuery({
    speciesId,
  });
  const refetch = familyInfo.refetch;
  const familyId = familyInfo.data?.[0]?.familyId;
  const familyDescription = familyInfo.data?.[0]?.description;
  const n_primary_feathers = familyInfo.data?.[0]?.n_primary_feathers;
  const n_secondary_feathers = familyInfo.data?.[0]?.n_secondary_feathers;
  return (
    <div>
      {familyInfo.isLoading && <>Loading...</>}
      {familyInfo.error && <>Error</>}
      {familyInfo.data && (
        <>
          <h2 className="mb-8 text-xl font-bold">Informações da Família</h2>
          <UpdateFamilyDescription
            familyId={familyId}
            familyDescription={familyDescription || ""}
            refetch={refetch}
          />
          <UpdateFamilyFeathers
            familyId={familyId || 0}
            refetch={refetch}
            n_primary_feathers={n_primary_feathers || 0}
            n_secondary_feathers={n_secondary_feathers || 0}
          />
        </>
      )}
    </div>
  );
};

export default FamilyInfo;
