import Image from "next/image";
import Login from "./login/login";
import Clearance from "./clearance/clearance";
import { FaUserCircle } from "react-icons/fa";

import Header from "./header";
export default function Home() {
  return (
    <>
 <Header />
    <Clearance />
    </>
  );
}
