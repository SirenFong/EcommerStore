import { ReactSortable } from "react-sortablejs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import Modal from "./Modal";

export default function StorageForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    qty: existingQty,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties,
    status: existingStatus,
    start: existingStart,
    end: existingEnd,
}) {
    const [titlePromotions, setTitlePromotions] = useState(existingTitle || "");
    const [statusPromotions, setStatusPromotions] = useState(existingStatus || "");
    const [startPromotions, setStartPromotions] = useState(existingStart || "");
    const [endPromotions, setEndPromotions] = useState(existingEnd || "");
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        axios.get("/api/categories").then((result) => {
            setCategories(result.data);
        });
    }, []);
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    return (

        <form onSubmit={""}>
            <div className="flex shadow-lg shadow-cyan-500/5 p-4">
                <div className="w-1/5">Thông tin cơ bản</div>

                <div className="w-4/5 bg-white p-7">
                    <label>Tiêu đề*</label>
                    <input
                        type="text"
                        placeholder="Nhập tên chương trình"
                        value={titlePromotions}
                        onChange={(ev) => setTitlePromotions(ev.target.value)}
                    />
                    <label>Trạng thái chương trình</label>
                    <select
                        onChange={(ev) => setStatusPromotions(ev.target.value)}
                        value={statusPromotions}
                    >
                        <option value="0">Không hoạt động</option>
                        <option value="1">Đang hoạt động</option>

                    </select>
                </div>
            </div>

            <div className="flex shadow-lg shadow-cyan-500/5 p-4">
                <div className="w-1/5">Thời gian
                    thời gian áp dụng chương trình khuyến mãi
                </div>

                <div className="w-4/5 bg-white p-7 flex gap-7">
                    <div className="w-1/2">
                        <label>Thời gian bắt đầu</label>
                        <input
                            type="datetime-local"
                            placeholder="Nhập tên sản phẩm"
                            value={startPromotions}
                            onChange={(ev) => setStartPromotions(ev.target.value)}
                        />
                    </div>
                    <div className="w-1/2">
                        <label>Thời gian kết thúc</label>
                        <input
                            type="datetime-local"
                            placeholder="Nhập tên sản phẩm"
                            value={endPromotions}
                            onChange={(ev) => setEndPromotions(ev.target.value)}
                        /></div>

                </div>
            </div>
            <div className="flex shadow-lg shadow-cyan-500/5 p-4">
                <div className="w-1/5">Điều kiện khuyến mãi
                    thời gian áp dụng chương trình khuyến mãi
                </div>

                <div className="w-4/5 bg-white p-7 ">
                    <button type="button" onClick={handleOpen}>
                        Click Me to Open Modal
                    </button>
                    <table className="basic mt-2 py-1 px-2 ">

                        <thead className="border-t-2">
                            <tr>
                                <td>Hình ảnh sản phẩm</td>
                                <td>Tên sản phẩm</td>
                                <td>Loại sản phẩm</td>

                                <td>Giá bán</td>
                                <td>Số lượng</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td colSpan={2}>
                                    <div className="py-4">

                                    </div>
                                </td>
                            </tr>



                        </tbody>
                    </table>

                </div>
            </div>
            <button type="submit" className="btn-primary">
                Lưu
            </button>
            <Modal isOpen={open} >
                <>
                    <div className="w-100">
                        <div className="flex shadow-lg justify-between shadow-cyan-500/5 p-4">
                            <h1>Thêm điều kiện</h1>
                            <button onClick={handleClose}>close</button>
                        </div>

                        <div className="shadow-lg shadow-cyan-500/5 p-4">

                            <select
                                onChange={(ev) => setCategorySelected(ev.target.value)}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected>Chọn loại sản phẩm</option>
                                {
                                    categories.map((category) => (
                                        <option value={category._id}>{category.name}</option>
                                    ))
                                }



                            </select>

                        </div>
                    </div>

                </>
            </Modal>
        </form>
    );
}
