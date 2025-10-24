import { Clerk } from "@clerk/clerk-sdk-node"; // ✅ named import

// Initialize the Clerk client with your secret key
const clerkClient = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

const authAdmin = async (userId) => {
  try {
    if (!userId) {
      console.error("authAdmin: Missing userId");
      return false;
    }

    // Get the user details
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    console.log("Admin check for:", email);

    // Compare email with your admin list
    return process.env.ADMIN_EMAIL.split(",").includes(email);
  } catch (error) {
    console.error("authAdmin error:", error);
    return false;
  }
};

export default authAdmin;
