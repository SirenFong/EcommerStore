import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";
import { prettyDate } from "@/lib/date";

function AdvPage({ swal }) {
    const [products, setProducts] = useState([]);

    const [featuredProductId1, setFeaturedProductId1] = useState("");
    const [featuredProductId2, setFeaturedProductId2] = useState("");
    const [bannerProductId1, setBannerProductId1] = useState("");
    const [bannerProductId2, setBannerProductId2] = useState("");
    const [bannerProductId3, setBannerProductId3] = useState("");
    const [bannerProductId4, setBannerProductId4] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        setIsLoading(true);
        fetchAll().then(() => {
            setIsLoading(false);
        });
    }, []);

    async function fetchAll() {
        await axios.get("/api/products").then((res) => {
            setProducts(res.data);
        });
        await axios.get("/api/advertisements?name=featuredProductId1").then((res) => {
            setFeaturedProductId1(res.data.value);
        });
        await axios.get("/api/advertisements?name=featuredProductId2").then((res) => {
            setFeaturedProductId2(res.data.value);
        });
        await axios.get("/api/advertisements?name=bannerProductId1").then((res) => {
            setBannerProductId1(res.data.value);
        });
        await axios.get("/api/advertisements?name=bannerProductId2").then((res) => {
            setBannerProductId2(res.data.value);
        });
        await axios.get("/api/advertisements?name=bannerProductId3").then((res) => {
            setBannerProductId3(res.data.value);
        });
        await axios.get("/api/advertisements?name=bannerProductId4").then((res) => {
            setBannerProductId4(res.data.value);
        });

    }

    async function saveSettings(ev) {
        setIsLoading(true);
        await axios.put("/api/advertisements", {
            name: "featuredProductId1",
            value: featuredProductId1,
        });
        await axios.put("/api/advertisements", {
            name: "featuredProductId2",
            value: featuredProductId2,
        });
        await axios.put("/api/advertisements", {
            name: "bannerProductId1",
            value: bannerProductId1,
        });
        await axios.put("/api/advertisements", {
            name: "bannerProductId2",
            value: bannerProductId2,
        });
        await axios.put("/api/advertisements", {
            name: "bannerProductId3",
            value: bannerProductId3,
        });
        await axios.put("/api/advertisements", {
            name: "bannerProductId4",
            value: bannerProductId4,
        });
        setIsLoading(false);
        await swal.fire({
            title: "Settings saved!",
            icon: "success",
        });
    }

    return (
        <Layout>
            <h1>Settings</h1>
            {isLoading && <Spinner />}
            {!isLoading && (
                <>
                    <div className="grid">
                        <label>Featured product</label>
                        <select
                            value={featuredProductId1}
                            onChange={(ev) => setFeaturedProductId1(ev.target.value)}
                        > <option value={""}>Bạn chưa chọn sản phẩm hiển thị</option>
                            {products.length > 0 &&
                                products.map((product) => (
                                    <option value={product._id}>{product.title}</option>
                                ))}
                        </select>
                        <label>Featured product 2</label>
                        <select
                            value={featuredProductId2}
                            onChange={(ev) => setFeaturedProductId2(ev.target.value)}
                        >
                            <option value={""}>Bạn chưa chọn sản phẩm hiển thị</option>
                            {products.length > 0 &&
                                products.map((product) => (
                                    <option value={product._id}>{product.title}</option>
                                ))}
                        </select>
                        <label>Banner product 1</label>
                        <select
                            value={bannerProductId1}
                            onChange={(ev) => setBannerProductId1(ev.target.value)}
                        >
                            <option value={""}>Bạn chưa chọn sản phẩm hiển thị</option>
                            {products.length > 0 &&
                                products.map((product) => (
                                    <option value={product._id}>{product.title}</option>
                                ))}
                        </select>
                        <label>Banner product 2</label>
                        <select
                            value={bannerProductId2}
                            onChange={(ev) => setBannerProductId2(ev.target.value)}
                        >
                            <option value={""}>Bạn chưa chọn sản phẩm hiển thị</option>
                            {products.length > 0 &&
                                products.map((product) => (
                                    <option value={product._id}>{product.title}</option>
                                ))}
                        </select>
                        <label>Banner product 3</label>
                        <select
                            value={bannerProductId3}
                            onChange={(ev) => setBannerProductId3(ev.target.value)}
                        >
                            <option value={""}>Bạn chưa chọn sản phẩm hiển thị</option>
                            {products.length > 0 &&
                                products.map((product) => (
                                    <option value={product._id}>{product.title}</option>
                                ))}
                        </select>
                        <label>Banner product 4</label>
                        <select
                            value={bannerProductId4}
                            onChange={(ev) => setBannerProductId4(ev.target.value)}
                        >
                            <option value={""}>Bạn chưa chọn sản phẩm hiển thị</option>
                            {products.length > 0 &&
                                products.map((product) => (
                                    <option value={product._id}>{product.title}</option>
                                ))}
                        </select>
                    </div>


                    <div>
                        <button onClick={saveSettings} className="btn-primary">
                            Save settings
                        </button>
                    </div>
                </>
            )}
        </Layout>
    );

}

export default withSwal(({ swal }) => <AdvPage swal={swal} />);
