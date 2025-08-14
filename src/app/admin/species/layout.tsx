import LogoutButton from "@/components/logoutButton";

export default function AdminSpeciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between bg-gray-600 p-4">
        <h1 className="text-2xl font-bold text-white">Admin Species</h1>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
