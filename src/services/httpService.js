import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    toast.error("An unexpected error occured", {
      toastId: "id",
    });
  }

  return Promise.reject(error);
});

// const toastId = React.useRef(null);
// const notify = () => {
//   if (!toast.isActive(toastId.current)) {
//     toastId.current = toast("An unexpected error occured");
//   }
// };

let http = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};

export default http;
