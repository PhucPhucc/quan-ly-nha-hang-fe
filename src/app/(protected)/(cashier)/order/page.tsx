import OrderDetailsSidebar from "@/components/features/menu/order/OrderDetailsSidebar";
import OrderViewSelector from "@/components/features/menu/order/OrderViewSelector";

const OrderPage = () => {
  return (
    <div className="flex h-[calc(100vh-20px)] w-full bg-background p-4 gap-4 overflow-hidden">
      {/* Left Column: Order Board & Menu Selection */}
      <OrderViewSelector />

      {/* Right Column: Order Details */}
      <OrderDetailsSidebar />
    </div>
  );
};

export default OrderPage;
