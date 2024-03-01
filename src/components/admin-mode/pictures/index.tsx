import Dropzone from "./dropzone";

export default function AddPicture({
  sexId,
  refetchImages,
}: {
  sexId: number;
  refetchImages: () => void;
}) {
  return <Dropzone sexId={sexId} refetchImages={refetchImages} />;
}
