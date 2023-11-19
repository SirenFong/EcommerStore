import Layout from "@/components/Layout";
import PromotionForm from "@/components/PromotionForm";

import StorageForm from "@/components/StogareForn";

export default function NewProduct() {
    return (
        <Layout>
            <h1>Quản lý chương trình khuyến mãi: Thêm mới</h1>
            <PromotionForm />
        </Layout>
    );
}
