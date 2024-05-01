import { currentUser } from "@clerk/nextjs/server";
export async function getUserInformation(){
    const user = await currentUser();
    console.log(user);
    return user
}