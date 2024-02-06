library(tidyverse)
spp <- read_csv("~/Documents/Programs/ilicura/data-management/SPP_REGISTER_202402051159.csv") 

family <- spp %>% select(family) %>% distinct() %>% mutate(id = row_number())
genus <- spp %>% select(genus, family) %>% distinct() %>% mutate(id = row_number())

genus_table <- genus %>% left_join(family, by = "family") %>% select(-family)%>%rename(family_id = id.y, id=id.x)
spp_table  <- spp %>% mutate(scientific_name = paste(genus, species) ) %>% left_join(genus, by = "genus")%>% select( id, sci_code, en_name, pt_name, scientific_name, spp_id) %>%rename(genus_id = id)%>%rename(id=spp_id)
family_table <- family %>% rename(name = family)



write_csv2(
    spp_table,
    path = "~/Documents/Programs/ilicura/data-management/spp_table.csv",
    col_names = TRUE
    )

write_csv2(
    family_table,
    path = "~/Documents/Programs/ilicura/data-management/family.csv",
    col_names = TRUE
    )    

write_csv2(
    genus,
    path = "~/Documents/Programs/ilicura/data-management/genus.csv",
    col_names = TRUE
    )