import { ReactSortable } from "react-sortablejs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import Modal from "./Modal";
import Multiselect from 'multiselect-react-dropdown';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function PromotionForm({
    _id,
    title: existingTitle,
    status: existingStatus,
    start: existingStart,
    end: existingEnd,
    condition: existingCondition,
}) {
    const numeral = require("numeral");
    const router = useRouter();
    const [goToProducts, setGoToProducts] = useState(false);
    const [titlePromotions, setTitlePromotions] = useState(existingTitle || "");
    const [statusPromotions, setStatusPromotions] = useState(existingStatus || "");
    const [startPromotions, setStartPromotions] = useState(existingStart || "");
    const [endPromotions, setEndPromotions] = useState(existingEnd || "");
    const [type, setType] = useState(1);
    const [reducedbymoney, setReducedbymoney] = useState();
    const [decreasebypercentage, setDecreasebypercentage] = useState();
    const [reducedproperties, setReducedproperties] = useState([]);
    const [open, setOpen] = useState(false);
    const [myArray, setMyArray] = useState(existingCondition || []);
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [values, setValues] = useState({})
    const formatter = new Intl.NumberFormat("en-US");
    const [selectedValueProducts, setselectedValueProducts] = useState(null);
    const [selectedValueCategories, setselectedValueCategories] = useState(null);
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {

        axios.get("/api/categories").then((result) => {
            setCategories(result.data);


        });


        axios.get("/api/products").then((result) => {
            setProducts(result.data);


        });


    }, []);






    function saveValue(ev) {
        ev.preventDefault();
        const data = {
            type: type,
            reducedbymoney,
            decreasebypercentage,
            values: values[0].map((p) => ({
                name: p,

            })),
        };
        setMyArray([...myArray, data]);
        setReducedbymoney("")
        setType("")
        setDecreasebypercentage("")
        setReducedproperties([])
        setOpen(false);
    }
    /////xử lý ngoài trang chính
    console.log(titlePromotions)
    console.log(statusPromotions)
    console.log(startPromotions)
    console.log(endPromotions)
    async function savePromotion(ev) {
        ev.preventDefault();
        const data = {
            title: titlePromotions,
            status: statusPromotions,
            start: startPromotions,
            end: endPromotions,
            condition: myArray[0],

        };
        console.log(data)
        if (_id) {
            await axios.put("/api/promotions", { ...data, _id });
            toast.error("Chương trình khuyến mãi đã cập nhật");
        } else {
            await axios.post("/api/promotions", data);
            toast.error("Chương trình khuyến mãi đã được thêm");
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push("/promotions");
    }
    /**rout
     * er dùng để redirect về trang products sau khi thêm mới 1 sản phẩm */
    const [editedValues, setEditedValues] = useState(null);

    async function editdata(i) {
        setOpen(true);
        setEditedValues(i);
        console.log(i.values)
        // setEditedCategory(index);
        setType(i.type);
        setReducedbymoney(i.reducedbymoney);
        setValues(i.values)



    }
    console.log(values)
    return (
        <>
            <ToastContainer />
            <form onSubmit={savePromotion}>
                <button type="submit" className="btn-primary">
                    Lưu
                </button>
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
                            <option value={false}>Không hoạt động</option>
                            <option value={true}>Đang hoạt động</option>

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
                            Thêm
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

                                {myArray.map((i, index) => (
                                    <tr key={i.index}>
                                        <td>{index + 1}</td>
                                        <td>{i.type == 1 ? "Danh mục" : i.type == 2 ? "Sản phẩm" : "Hóa đơn"}</td>

                                        <td>{formatter.format(i.reducedbymoney)}</td>
                                        <td >
                                            <button id="btnId" type="button" onClick={() => editdata(i)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                            <button className="p-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>



                                    </tr>

                                ))}

                            </tbody>
                        </table>

                    </div>
                </div>



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

                                        type="text"
                                        placeholder="Nhập giá tiền giảm"
                                        name="reducedbymoney "
                                        id="reducedbymoney"
                                        onChange={(ev) => {
                                            const formattedPrice = numeral(ev.target.value).value();
                                            setReducedbymoney(formattedPrice);
                                        }}

                                        value={reducedbymoney === null ? "" : numeral(reducedbymoney).format("0,0")}
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

                            <div className="shadow-lg shadow-cyan-500/5  ">
                                {type != "3" && (
                                    <div className="w-3/3 p-7">
                                        Nhập {type == "2" ? ("Sản phẩm") : ("Danh mục")}

                                        <Multiselect
                                            value={values}

                                            name={type == "1" ? categories : products}
                                            options={type == "1" ? categories : products} // Options to display in the dropdown
                                            // Preselected value to persist in dropdown
                                            onSelect={(e) => { setValues([e]) }} // Function will trigger on select event
                                            onRemove={(e) => { setValues(e) }}// Function will trigger on remove event
                                            displayValue={type == "1" ? "name" : "title"}// Property name to display in the dropdown options
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
                            <button id="btnId" type="button" onClick={saveValue}>thêm</button>
                        </div>

                    </>
                </Modal>
            </form>
        </>

    );
}
