// This layout is specific to the admin panel and does not include the public Header and Footer.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="bg-background text-foreground">
          {children}
      </div>
  );
}
