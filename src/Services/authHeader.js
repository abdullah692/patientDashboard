export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    console.log(user, "userrrrrauthhhhhh");
    return {
      authorization: `Bearer ${user.accessToken}`,
    };
  } else {
    return {};
  }
}
