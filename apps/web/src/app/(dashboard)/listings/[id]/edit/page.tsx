export default function EditListingPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-heading font-bold mb-6">Edit Listing</h1>
      <p className="text-muted-foreground">
        Editing listing {params.id} — form reuses New Listing component with pre-filled data.
      </p>
    </div>
  );
}
