import AnimatedDiv from "../ui/AnimatedDiv";
import { motion } from "framer-motion";

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number;
  loading: boolean;
  color: "blue" | "green" | "purple";
};

const StatCard = ({ icon, title, value, loading, color }: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100",
    green: "bg-green-50 border-green-100",
    purple: "bg-purple-50 border-purple-100",
  };

  return (
    <AnimatedDiv>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className={`rounded-xl p-6 border ${colorClasses[color]} h-full shadow-sm`}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-black">{title}</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
            ) : (
              <p className="text-2xl font-bold mt-1 text-gray-500">
                {value.toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <div className="p-3 rounded-full bg-white shadow-sm">{icon}</div>
        </div>
      </motion.div>
    </AnimatedDiv>
  );
};

export default StatCard;
