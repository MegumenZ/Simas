import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { FiRefreshCw } from "react-icons/fi";

const RefreshButton = () => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await router.refresh();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      variant="primary"
      className="flex items-center gap-2"
      size="sm"
      disabled={isRefreshing}
    >
      <FiRefreshCw
        className={`text-sm ${isRefreshing ? "animate-spin" : ""}`}
      />
      <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
    </Button>
  );
};

export default RefreshButton;
