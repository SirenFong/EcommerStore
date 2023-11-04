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
                        <th className="text-left">Avatar</th>
                        <th >Admin google email</th>
                        <th>Name</th>

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
                                <td>{user.image && (<img src={user.image} alt="" className="w-12 h-12" />)
                                    || (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>)

                                }</td>
                                <td className="text-center">{user.email}</td>
                                <td className="text-center">{user.name}</td>

                                <td>
                                    {user.createdAt && prettyDate(user.createdAt)}
                                </td>
                                <td>

                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }) => <UserPage swal={swal} />);
