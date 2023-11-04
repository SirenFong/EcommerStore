import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import { prettyDate } from "@/lib/date";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { useSession } from "next-auth/react";
function UserPage({ swal }) {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(false);


    function loadUsers() {
        setIsLoading(true);
        axios.get("/api/users").then((res) => {
            setUsers(res.data.filter((item) => item.email !== session?.user?.email));
            setIsLoading(false);
        });
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <Layout>

            <h1>Thông tin tài khoản người dùng</h1>
            {/* <form onSubmit={addAdmin}>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="mb-0"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        placeholder="google email"
                    />
                    <button type="submit" className="btn-primary py-1 whitespace-nowrap">
                        Add admin
                    </button>
                </div>
            </form> */}

            <h2>Danh sách tài khoản người dùng</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <th className="text-left">Admin google email</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className="py-4">
                                    <Spinner fullWidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {users.length > 0 &&
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.name}</td>
                                <td>{user.phone}</td>
                                <td>
                                    {user.createdAt && prettyDate(user.createdAt)}
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            deleteAdmin(user._id, user.email)
                                        }
                                        className="btn-red"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }) => <UserPage swal={swal} />);
