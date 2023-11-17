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
    const [type, setType] = useState();
    const [reducedbymoney, setReducedbymoney] = useState();
    const [decreasebypercentage, setDecreasebypercentage] = useState();
    const [reducedproperties, setReducedproperties] = useState([]);
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
    const [form, setValues] = useState({

        type: type,
        reducedbymoney: reducedbymoney,
        decreasebypercentage: decreasebypercentage,
        reducedproperties: reducedproperties

    });
    console.log(type, reducedbymoney, decreasebypercentage, reducedproperties);
    const data = {
        type, reducedbymoney, decreasebypercentage, reducedproperties
    };
    console.log(data)
    let arr = []
    function add() {
        console.log(data)
    }
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClick = () => {
        console.log('button clicked');
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
                    <button type="button" className="btn-info" onClick={handleOpen}>
                        Click Me to Open Modal
                    </button>
                    <table className="basic mt-2 py-1 px-2 ">

                        <thead className="border-t-2">
                            <tr>

                                <td>STT</td>
                                <td>Áp dụng</td>
                                <td>Giá trị giảm</td>
                                <td>tác vụ</td>
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
            <button type="button" onClick={handleOpen}>
                Click Me to Open Modal
            </button>
            <Modal isOpen={open} onClose={handleClose}>
                <>
                    <h1>GFG</h1>
                    <h3>A computer science portal!</h3>
                </>
            </Modal>
            <Modal isOpen={open} >
                <>
                    <div className="w-[50rem]">
                        <div className="flex shadow-lg justify-between shadow-cyan-500/5 p-4">
                            <h1>Thêm điều kiện</h1>
                            <button onClick={handleClose}>close</button>
                        </div>

                        <div className="p-7">
                            <div >Loại
                            </div>
                            <select
                                name="decreasebypercentage"
                                id="decreasebypercentage"
                                onChange={(ev) => setType(ev.target.value)}
                                value={type === null ? "" : type}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="1">Danh mục</option>
                                <option value="2">sản phẩm</option>
                                <option value="3">Đơn hàng</option>

                            </select>

                        </div>
                        <div className="flex shadow-lg shadow-cyan-500/5 ">
                            <div className=" bg-white p-7 ">
                                Giá trị giảm
                                <input

                                    type="number"
                                    placeholder="Nhập giá tiền giảm"
                                    name="reducedbymoney "
                                    id="reducedbymoney"
                                    onChange={(ev) => setReducedbymoney(ev.target.value)}
                                    value={reducedbymoney === null ? "" : reducedbymoney}
                                />

                            </div>
                            <div className="py-14">Hoặc</div>
                            <div className=" bg-white p-7 ">Phần trăm giảm
                                <input

                                    type="text"
                                    placeholder="Nhập % giảm"
                                    name="decreasebypercentage"
                                    id="decreasebypercentage"
                                    onChange={(ev) => setDecreasebypercentage(ev.target.value)}
                                    value={decreasebypercentage === null ? "" : decreasebypercentage}
                                />
                            </div>
                        </div>
                        <div className="flex shadow-lg shadow-cyan-500/5  ">
                            {type != "3" && (
                                <div className="w-3/3 p-7">
                                    Nhập {type == "2" ? ("Sản phẩm") : ("Danh mục")}
                                    <input

                                        type="text"
                                        placeholder="Tìm...."

                                        name=" reducedproperties"
                                        id=" reducedproperties"
                                        onChange={(ev) => setReducedproperties(ev.target.value)}
                                        value={reducedproperties === null ? "" : reducedproperties}
                                    />
                                </div>

                            )


                            }


                            {type == "3" && (
                                <>
                                    <div className="w-3/3 p-7">
                                        Nhập giá trị đơn hàng tối thiểu
                                        <input
                                            type="number"
                                            placeholder="Nhập giá trị tối thiểu của đơn hàng"
                                            name=" reducedproperties"
                                            id=" reducedproperties"
                                            onChange={(ev) => setReducedproperties(ev.target.value)}
                                            value={reducedproperties === null ? "" : reducedproperties}
                                        />
                                    </div>

                                </>

                            )


                            }
                        </div>
                        <div onClick={() => handleClick}>thêm</div>
                    </div>

                </>
            </Modal>
        </form>
    );
}
