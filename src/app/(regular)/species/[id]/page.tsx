import { api } from "@/trpc/server";
import { agesEnum, moltExtensionEnum, moltTypesEnum } from "@/server/db/schema";
import {
  moltExtensionEnumTranslation,
  moltLimitsEnumTranslation,
  skullEnumTranslation,
} from "@/translations/translation";
import Link from "next/link";
import CarouselDialog from "@/components/carousel-dialog";
import CarouselDialogEntry, {
  DialogCarousel,
} from "@/components/carousel-dialog/entry";
import { ArrowLeftIcon, Bird, Dna, Feather } from "lucide-react";
import PWAImage from "@/components/pwa-image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Image from "next/image";

type SpeciesData = Awaited<ReturnType<typeof api.species.getById.query>>;

export default async function Home({ params }: { params: { id: string } }) {
  const id = +params.id;
  if (!id) return <p>no id</p>;

  const speciesData = await api.species.getById.query({ id });

  type moltTypesType = (typeof moltTypesEnum.enumValues)[number];
  type moltExtesionsType = (typeof moltExtensionEnum.enumValues)[number];

  if (!speciesData) return <p>no data</p>;

  return (
    <>
      {/* <pre>{JSON.stringify(speciesData, null, 2)}</pre> */}
      <main className="container flex min-h-screen flex-col  text-slate-900">
        <div className=" w-full items-center  py-24">
          <div className="mx-auto  flex max-w-[900px] flex-row items-center justify-start gap-2">
            <ArrowLeftIcon /> <Link href="/species">Explorar</Link>
          </div>
          <div className="variant mb-4 flex w-full flex-col gap-8 overflow-hidden md:flex-row md:justify-between">
            <CarouselDialogEntry pictures={speciesData.featuredPictures} />
          </div>
          <div className="mx-auto flex max-w-[900px] flex-col">
            <div className="flex flex-col md:flex-row md:justify-between ">
              <div className="flex flex-col  gap-0  font-cardo">
                <div className="mb-12 flex flex-col gap-1">
                  <h1 className="  w-full font-cardo text-3xl font-extrabold  tracking-tight md:text-6xl ">
                    {speciesData.scientificName}
                  </h1>
                  <p className="font-b612 text-lg ">
                    <span className="font-bold">{speciesData.sciCode}</span> -{" "}
                    {speciesData.ptName}
                  </p>
                </div>
              </div>
              <BandSizeSection speciesData={speciesData} />
            </div>
            <div className="mb-12   pb-4">
              <FamilyInfoSection speciesData={speciesData} />

              <div className="flex flex-col gap-4 font-b612">
                <div>
                  <p className="text-lg">
                    <span className="font-bold">Penas: </span>
                    <span className="text-gray-600  ">
                      {speciesData.family.n_primary_feathers} primárias /{" "}
                      {speciesData.family.n_secondary_feathers} secundárias
                    </span>
                  </p>
                </div>
                {speciesData.family.name === "Trochilidae" && (
                  <div>
                    <p className="text-lg">
                      <span className="font-bold">
                        Corrugação do Bico (beija-flores):{" "}
                      </span>
                      {speciesData.hummingbirdBillCorrugation.length === 0 &&
                        "Sem registros"}
                      {speciesData.hummingbirdBillCorrugation?.map(
                        (corrugation, i) => (
                          <span
                            key={corrugation?.id}
                          >{`${i > 0 ? ", " : ""}${corrugation?.age}: ${corrugation?.billCorrugation}`}</span>
                        ),
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-lg">
                    <span className="font-bold">Crânio: </span>
                    <span className="text-gray-600  ">
                      {speciesData.skull.length === 0 && "Sem registros"}
                      {speciesData.skull?.map((strategy) => {
                        if (strategy.closes)
                          return (
                            <span key={strategy?.id}>
                              {skullEnumTranslation[strategy.closes]} (
                              {strategy?.notes})
                            </span>
                          );
                      })}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-lg">
                    <span className="font-bold">Estratégias de Muda: </span>
                    <span className="text-gray-600  ">
                      {speciesData.moltStrategies.length === 0 &&
                        "Sem registros"}
                    </span>
                    {speciesData.moltStrategies?.map((strategy, i) => (
                      <span key={strategy?.id}>
                        {i > 0 && " / "}
                        {strategy?.strategy}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8  font-b612">
              <h2 className="mb-1 mt-2 w-full text-left font-b612 text-sm ">
                Mudas{" "}
              </h2>
              <div>
                {speciesData.moltExtensions.length === 0 && (
                  <p className="text-gray-600  ">Sem registros</p>
                )}
                <ul>
                  {speciesData.moltExtensions
                    ?.sort(
                      //sort by enum order
                      (a, b) =>
                        moltTypesEnum.enumValues.indexOf(
                          a.moltType as moltTypesType,
                        ) -
                        moltTypesEnum.enumValues.indexOf(
                          b.moltType as moltTypesType,
                        ),
                    )
                    .map((extension) => (
                      <li key={extension?.moltType}>
                        <div className="mb-4">
                          <p className="mb-0">
                            <span className="text-lg font-extrabold">
                              {" "}
                              {extension?.moltType.replace("1", "F")}:{" "}
                            </span>

                            {extension?.extensions
                              .sort(
                                (a, b) =>
                                  moltExtensionEnum.enumValues.indexOf(
                                    a.extension as moltExtesionsType,
                                  ) -
                                  moltExtensionEnum.enumValues.indexOf(
                                    b.extension as moltExtesionsType,
                                  ),
                              )

                              .map((ext, i) => (
                                <span key={ext.id} className="text-lg">
                                  {i > 0 && ", "}
                                  {
                                    moltExtensionEnumTranslation[
                                      ext?.extension as keyof typeof moltExtensionEnumTranslation
                                    ]
                                  }
                                </span>
                              ))}
                          </p>
                          <p>
                            {extension.molLimits.length > 0 && (
                              <span>Limites de Muda: </span>
                            )}
                            {extension.molLimits.map((limit, i) => (
                              <span key={limit.id}>
                                {i > 0 && ", "}{" "}
                                {
                                  moltLimitsEnumTranslation[
                                    limit.limit as keyof typeof moltLimitsEnumTranslation
                                  ]
                                }
                              </span>
                            ))}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="mb-8  ">
              <h2 className="mb-1 mt-2 w-full text-left font-b612 text-sm ">
                Idade e Sexo
              </h2>

              {speciesData.ageInfo.length === 0 && (
                <p className="text-gray-600  ">Sem registros</p>
              )}
              <ul className="font-b612">
                {speciesData.ageInfo
                  ?.sort(
                    //sort by enum order
                    (a, b) =>
                      agesEnum.enumValues.indexOf(a.age!) -
                      agesEnum.enumValues.indexOf(b.age!),
                  )
                  .map((age) => (
                    <li key={age?.id} className="mb-16">
                      <div className="mb-4">
                        {age?.sex.map((sex, i) => (
                          <div className="mb-8" key={sex.id}>
                            <p className="mb-4 text-lg">
                              <span className=" font-bold">
                                {age.age} - {sex.sex}
                              </span>
                              {sex.description && (
                                <span>: {sex.description}</span>
                              )}
                            </p>

                            {sex.pictures?.length > 0 && (
                              <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
                                {sex.pictures
                                  ?.filter((picture) => picture?.thumbnail)
                                  .map((picture, i) => (
                                    <div key={picture?.id}>
                                      <CarouselDialog
                                        image={picture?.url ?? ""}
                                      >
                                        <PWAImage
                                          src={
                                            picture?.url
                                              ? `${picture?.url}?tr=q-5`
                                              : ""
                                          }
                                          alt={picture?.thumbnail ?? ""}
                                          className="h-full w-full object-cover"
                                        />
                                      </CarouselDialog>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            {speciesData.initialDescription && (
              <div>
                <h2 className="text-sm">Notas </h2>

                <p className="whitespace-pre-wrap text-lg leading-relaxed">
                  {speciesData.initialDescription.description}
                </p>
              </div>
            )}
            <div className="mt-12">
              <h2 className="text-sm">Fontes</h2>

              <p className="text-md whitespace-pre-wrap leading-relaxed">
                <span className="font-bold">
                  Monitoramento de Longo Prazo do Observatório de Aves da
                  Mantiqueira
                </span>{" "}
                Serra da Mantiqueira, Sudeste, Brasil. ( N=
                {speciesData.totalCaptures}).
              </p>
            </div>
          </div>

          <Link
            href={`/admin/species/${id}`}
            className=" rounded-lg  border-transparent bg-transparent px-12 py-12  text-white hover:border-slate-400 hover:text-slate-400"
          >
            ADMIN
          </Link>
        </div>
      </main>
    </>
  );
}

const BandSizeSection = ({ speciesData }: { speciesData: SpeciesData }) => {
  const secondaryBandSize = speciesData.bandSize.filter(
    (size) => size.isSecondary,
  );

  return (
    <div className="flex h-full flex-col font-b612 md:items-end md:justify-end md:px-8 md:py-2 md:text-right ">
      <p className="text-sm  md:text-right">Anilha</p>

      <p className="text-2xl font-bold">
        {speciesData.bandSize
          .filter((size) => !size.isSecondary)
          .map((size) => size.bandSize)
          .join(", ")}

        {secondaryBandSize.length > 0 && (
          <span className="text-lg ">
            {" "}
            ({secondaryBandSize.map((size) => size.bandSize).join(", ")})
          </span>
        )}

        {speciesData.hummingbirdBandCircumference.length > 0 && (
          <span className="text-sm font-bold">
            {" "}
            (
            {speciesData.hummingbirdBandCircumference
              .map(
                (size) =>
                  `${size.bandCircumference}${size.bandCircumference?.includes("mm") ? "" : " mm"}`,
              )
              .join(", ")}
            )
          </span>
        )}
      </p>
    </div>
  );
};

const FamilyInfoSection = ({ speciesData }: { speciesData: SpeciesData }) => {
  console.log(speciesData.family);
  return (
    <Accordion type="single" collapsible className="w-fit">
      <AccordionItem value="item-1">
        <AccordionTrigger className="` ">
          <p className="text-lg">
            <span className="font-bold">Família: </span>
            <span className="text-gray-600  ">{speciesData.family.name}</span>
          </p>
        </AccordionTrigger>
        <AccordionContent>{speciesData.family.description}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
