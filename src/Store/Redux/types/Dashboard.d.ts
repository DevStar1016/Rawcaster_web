

type claimAccountProps = {
    show:boolean,
    msg:string
}


type GroupMemberData =   {
    user_id: number,
    email_id: string,
    member_arn?:string | null,
    first_name?:string | null,
    last_name?:string | null,
    display_name?: string | null,
    gender?: number,
    profile_img?: string | null,
    online?: number,
    last_seen?: string | null,
    typing?: number,
  }


type GroupData = {
    group_id: number,
    group_name: string,
    locked: number,
    channel_arn:string | null,
    owner_membership_type: number,
    group_icon: string | null,
    group_member_count:number,
    group_owner:number,
    typing:number,
    chat_enabled:number,
    group_type:number,
    group_access:number,
    group_category:number,
    last_msg:string | null,
    last_msg_datetime: string,
    result_list:number,
    group_member_ids: number[],
    group_members_list: GroupMemberData[],
  }

  type FriendData = {
    friend_request_id: number,
    user_id: number,
    user_ref_id: string,
    channel_arn: string | null,
    email_id: string,
    first_name: string,
    last_name:string | null,
    display_name:string,
    gender: number,
    profile_img:string,
    online: number,
    last_seen: string,
    typing: number,
    unreadmsg: number,
    follow: boolean,
    last_msg: string |null,
    last_msg_datetime:string | null,
    login_from: number,
    login_from_app: number,
    login_from_web: number,
    friend_status: number,
    chime_user_id:string,
  }
export type DashoardProps = {
    isLoading: boolean,
    isTwoStepVerified: boolean,
    loginModalShow: boolean,
    profileVerifyModalShow: claimAccountProps,
    twostepVerifyModalshow: boolean,
    dashboardMenu:"event" | "notification" | "nugget" | "usermenu",
    isVeifyEnabled: boolean,
    isGlobalSearch: boolean,
    friendsList: FriendData[],
    isFriendsLoading: boolean,
    groupsList: GroupData[],
    isGroupLoading: boolean,
    DashboardfilterType: number,
    claimAccount:claimAccountProps,
    notificationUnreadCount: number,
}