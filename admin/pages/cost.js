import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { withSwal } from "react-sweetalert2";
import { prettyDate } from "@/lib/date";

function CostsPage({ swal }) {


    const [isLoading, setIsLoading] = useState(false);
    const [services, setservices] = useState("");
    const [name, setName] = useState("");
    const [value, setValue] = useState("");
    const [editedService, setEditedService] = useState(null);
    useEffect(() => {

        fetchAll()


    }, []);

    async function fetchAll() {
        setIsLoading(true);
        await axios.get("/api/services").then((res) => {
            setservices(res.data);
            setIsLoading(false);
        });

    }
    async function saveService(ev) {
        ev.preventDefault();
        const data = {
            name,
            value,
        };
        if (editedService) {
            data._id = editedService._id;
            await axios.put("/api/services", data);
            setEditedService(null);

        } else {
            await axios.post("/api/services", data);
        }
        setName("");
        setValue("");
        fetchAll();
        await swal.fire({
            title: "Settings saved!",
            icon: "success",
        });
    }
    function editService(service) {
        setEditedService(service);
        setName(service.name);
        setValue(service.value);

    }
    function deleteService(service) {
        swal
            .fire({
                title: "Xóa dịch vụ",
                text: `Bạn có muốn xóa ${service.name}?`,
                showCancelButton: true,
                cancelButtonText: "Cancel",
                confirmButtonText: "Yes, Delete!",
                confirmButtonsColor: "#d55",
                reverseButtons: true,
            })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const { _id } = service;
                    axios.delete("/api/services?_id=" + _id);
                    fetchAll()
                }
            });
    }

    return (
        <Layout>

            <h1>Dịch vụ</h1>

            <label>
                {editedService
                    ? `Sửa dịch vụ ${editedService.name}`
                    : "Tên dịch vụ mới"}
            </label>
            <form onSubmit={saveService} >
                <div className="flex gap-1">

                    <input
                        type="text"
                        onChange={(ev) => setName(ev.target.value)}
                        value={name}
                        placeholder={"Tên dịch vụ mới"}
                    />



                    <input
                        type="number"
                        onChange={(ev) => setValue(parseFloat(ev.target.value.split(".").join("")))}
                        value={value}
                        placeholder={"Giá dịch vụ"}
                    />

                </div>
                <div className="flex gap-1">

                    <button type="summit" className="btn-primary py-1">
                        Save
                    </button>
                </div>
            </form>
            <h2>Danh sách tài khoản người dùng</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Tên dịch vụ</th>
                        <th > giá diền</th>
                        <th>Thời gian tạo</th>
                        <th>Thời gian cập nhật</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={4}>
                                <div className="py-4">
                                    <Spinner fullWidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {services.length > 0 &&
                        services.map((service) => (
                            <tr key={service._id}>

                                <td className="text-center">{service.name}</td>
                                <td className="text-center">{service.value}</td>

                                <td>
                                    {service.createdAt}
                                </td>
                                <td>
                                    {service.updatedAt}
                                </td>
                                <td>
                                    <button
                                        onClick={() => editService(service)}
                                        className="btn-default mr-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteService(service)}
                                        className="btn-red"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </Layout >
    );
}

export default withSwal(({ swal }) => <CostsPage swal={swal} />);
