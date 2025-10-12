export default function VendorCard({ vendor }: { vendor:any }){
  const cats = Array.isArray(vendor.categories) ? vendor.categories.join(", ") : vendor.categories
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h3 className="card-title">{vendor.storeName}</h3>
        {cats && <p className="text-sm opacity-70">{cats}</p>}
        {vendor.approved === false && <div className="badge badge-warning">Pending</div>}
      </div>
    </div>
  )
}
