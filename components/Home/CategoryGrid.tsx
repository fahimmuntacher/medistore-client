import { Baby, Leaf, Pill, Stethoscope, UserIcon } from "lucide-react";

const categories = [
  {
    name: "Prescription",
    icon: <Pill className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    name: "Personal Care",
    icon: <UserIcon className="h-6 w-6" />,
    color: "bg-pink-500",
  },
  {
    name: "Baby Care",
    icon: <Baby className="h-6 w-6" />,
    color: "bg-purple-500",
  },
  { name: "Herbal", icon: <Leaf className="h-6 w-6" />, color: "bg-green-500" },
  {
    name: "Devices",
    icon: <Stethoscope className="h-6 w-6" />,
    color: "bg-orange-500",
  },
];

export const CategoryGrid = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
        <p className="text-muted-foreground">
          Find exactly what you need quickly
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div key={cat.name} className="group cursor-pointer">
            <div className="flex flex-col items-center p-6 rounded-2xl bg-white border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300">
              <div
                className={`${cat.color} p-4 rounded-xl text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                {cat.icon}
              </div>
              <span className="font-semibold text-slate-700">{cat.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
