
import { MainLayout } from "@/components/layout/MainLayout";
import { PromoVideoScript } from "@/components/marketing/PromoVideoScript";
import { Video } from "lucide-react";

export default function PromoVideo() {
  return (
    <MainLayout>
      <div className="flex items-center mb-6">
        <Video className="h-5 w-5 mr-2" />
        <h1 className="text-3xl font-semibold tracking-tight">Promotional Video Script</h1>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <PromoVideoScript />
      </div>
    </MainLayout>
  );
}
