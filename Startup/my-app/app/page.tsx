
import Image from "next/image";
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Home() {


  return (
    <div>
       <li>
        <Link href="/routes">Home</Link>
      </li>
    <h1 style = {{color: 'white'}}>Planning Poker</h1>
    <button  className = "button-43"> Join as Host</button>
    <button className = "button-43"> Join as User</button>
    </div>
  )
};