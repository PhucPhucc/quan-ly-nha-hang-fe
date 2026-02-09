import OrderDetailsSidebar from "@/components/features/order/OrderDetailsSidebar";
import OrderViewSelector from "@/components/features/order/OrderViewSelector";

const OrderPage = () => {
  return (
    <div className="flex h-[calc(100vh-100px)] w-full bg-muted/40 p-2 gap-2 overflow-hidden">
      {/* Left Column: Order Board & Menu Selection */}
      <OrderViewSelector />

      {/* Right Column: Order Details */}
      <OrderDetailsSidebar />
    </div>
  );
};

export default OrderPage;
