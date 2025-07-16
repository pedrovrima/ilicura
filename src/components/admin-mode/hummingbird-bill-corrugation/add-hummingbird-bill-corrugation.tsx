import { api } from "@/trpc/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agesEnum } from "@/server/db/schema";

const ages = agesEnum.enumValues;
type AgeType = (typeof ages)[number];

export default function AddHummingbirdBillCorrugation({
  speciesId,
  refetch,
}: {
  speciesId: number;
  refetch: () => void;
}) {
  const [age, setAge] = useState<AgeType>();
  const [billCorrugation, setBillCorrugation] = useState<string>("");

  const addHummingbirdBillCorrugation =
    api.speciesInfo.addHummingbirdBillCorrugation.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!age || !billCorrugation) return;
        addHummingbirdBillCorrugation.mutate(
          { speciesId, age, billCorrugation },
          {
            onSuccess: () => {
              setAge(undefined);
              setBillCorrugation("");
              refetch();
            },
          },
        );
      }}
      className="flex flex-row items-center gap-2"
    >
      <Select
        onValueChange={(value) => setAge(value as AgeType)}
        defaultValue={age}
        required
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Idade" />
        </SelectTrigger>
        <SelectContent>
          {ages.map((age) => (
            <SelectItem key={age} value={age}>
              {age}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        value={billCorrugation}
        onChange={(e) => setBillCorrugation(e.target.value)}
        placeholder="Corrugação do bico"
        className="w-48"
        required
      />
      <SubmitButton isLoading={addHummingbirdBillCorrugation.isLoading} />
    </form>
  );
}
