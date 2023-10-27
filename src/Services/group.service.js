import authApi from "../Utils/axiosconfig";
import authHeader from "./authHeader";

class GroupService {
    fetchGroupById(id){
        return authApi.get(`group/${id}`, { headers: authHeader() });
    }
    fetchGroupMemberById(id){
        return authApi.get(`groupmember/${id}`, { headers: authHeader() });
    }
    fetchGroupName(){
        return authApi.get(`groupname`, { headers: authHeader() });
    }
}

export default new GroupService();