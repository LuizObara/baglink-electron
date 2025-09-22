import { Item } from "@/types/item";

export default function ItemsList({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 w-full">{item.url}</h3>
          <p className="text-sm text-gray-500">
            Added on: {new Date(item.created_at).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">By: {item.username}</p>
          <p className="text-sm">
            Status: {item.finish ? "Finished" : "Pending"}
          </p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Visit Link
            </a>
          )}
        </div>
      ))}
    </div>
  );
}