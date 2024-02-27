import Dropzone from "./dropzone";

export default function AddPicture({ sexId }: { sexId: number }) {
  return <Dropzone sexId={sexId} />;
}
