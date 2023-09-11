


interface PolloptionProps {
    option_id: number,
    option_name: string,
    option_percentage: number,
    votes: number,
};
  
interface NotificationDataProps {
    notification_id: number,
    user_id: number,
    userName: string | null,
    userImage:string | null,
    type: number,
    content:number | null,
    created_datetime:string | null,
    is_read:number | null,
    friend_request_id?:number | null,
    friend_request_status? :number | null | string,
    event_id?:number | null,
    event_start_time?:number|null,
    ref_id?:number|null,
    group_id?:number | null,
    read_datetime?:string | null,
    nugget_id?:number | null,
    poll_option?:PolloptionProps[]
    total_vote?:number,
}

interface NotificationsProps {
    today: NotificationDataProps[],
    yesterday: NotificationDataProps[],
    older: NotificationDataProps[],
    total_pages: number,
    current_page_no:number,
    msg:number,
}


export type NotificationProps = {
    isTabChange: boolean,
    isLoading: boolean,
    Notifications: NotificationsProps,
}