import Layout from "@/components/Layout";
import PaymentForm from "@/components/PaymentForm";


export default function NewPaymentType() {
    return (
        <Layout>
            <h1>Thêm mới loại thanh toán</h1>
            <PaymentForm />
        </Layout>
    )
}