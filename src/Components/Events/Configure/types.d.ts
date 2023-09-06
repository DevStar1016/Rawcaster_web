export type MelodyProps = {
    path: string,
    type: string | number,
    is_default: string
}

export type EventDataProp = {
    event_id: number,
    event_name: string,
    reference_id: string,
    chime_meeting_id: string,
    type: number,
    event_type_id: number,
    event_layout_id: number,
    message: string,
    start_date_time: string,
    start_date: string,
    start_time: string,
    duration: string,
    no_of_participants: number,
    banner_image:string,
    is_host: number,
    created_at:string,
    original_user_name: string,
    original_user_id:number,
    original_user_image: string,
    event_melody_id: number,
    waiting_room: number,
    join_before_host: number,
    sound_notify: number,
    user_screenshare: number,
    melodies: MelodyProps,
    default_host_audio: number,
    default_host_video: number,
    default_guest_audio:number,
    default_guest_video: number
}
