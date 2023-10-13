export interface loginUserDataProps  {
    user_id: number,
    user_ref_id?:string | null,
    is_email_id_verified?: number | null | string,
    is_mobile_no_verified?: number | null | string,
    acc_verify_status?: number | null | string,
    is_profile_updated?: number | null | string,
    name?:string | null,
    email_id?:string | null,
    mobile?:string | null,
    profile_image?:string | null,
    cover_image?:string | null,
    website?: string | null,
    first_name?: string | null,
    last_name?: string | null,
    gender?: number| null,
    other_gender?:string | null,
    dob?:string | null,
    country_code?:string | null,
    country_id?: number | null | string,
    user_code?:string | null,
    geo_location?:string | null,
    latitude?:string | null,
    longitude?:string | null,
    date_of_join?:string | null,
    user_type?:string | null,
    user_status?:string | null,
    user_status_id?: number | null | string,
    bio_data?:string | null,
    followers_count?: number | null | string,
    friend_count?: number | null | string,
    following_count?: number | null | string,
    nugget_count?: number | null | string,
    event_count?: number | null | string,
    work_at?: string | null,
    studied_at?: string | null,
    influencer_category?:string | null,
    account_verify_type?: number | null | string,
    saved_nugget_count?: number | null | string,
    nugget_content_length?:number | null | string,
    chime_user_id?:string | null,
    ai_content_length?: number | null | string,
    referral_link?:string | null,
    language?: string | null,
    two_type_verification?: number | null | string,
    unread_notification_count?:number | null | string,
}


export interface loginUserSettingsProps  {
    referral_needed: number | null | string,
    max_event_duration: number | null | string,
    max_event_participants_count: number | null | string,
    online_status: number | null | string,
    online_group_list: number[],
    phone_display_status: number | null | string,
    phone_group_list: number[],
    location_display_status: number | null | string,
    location_group_list: number[],
    dob_display_status: number | null | string,
    dob_group_list: number[],
    bio_display_status: number | null | string,
    bio_group_list: number[],
    public_nugget_display: number | null | string,
    nugget_display_list: number[],
    public_event_display: number | null | string,
    event_display_list: number[],
    event_type:  number | null | string,
    friend_request: string | null,
    nuggets: string | null,
    events: string | null,
    passcode_status: number | null | string,
    passcode: number | null | string,
    waiting_room: number | null | string,
    schmoozing_status: number | null | string,
    breakout_status: number | null | string,
    join_before_host: number | null | string,
    auto_record: number | null | string,
    participant_join_sound: number | null | string,
    screen_share_status: number | null | string,
    virtual_background: number | null | string,
    host_audio: number | null | string,
    host_video: number | null | string,
    participant_audio: number | null | string,
    participant_video: number | null | string,
    melody: number | null | string,
    default_melody: string | null,
    meeting_header_image: string | null,
    language_id: number | null | string,
    time_zone: string | null,
    default_date_format: string | null,
    mobile_default_page: number | null | string,
    account_active_inactive: number | null | string,
    lock_nugget: number | null | string,
    lock_fans:number | null | string,
    lock_my_connection: number | null | string,
    lock_my_influencer: number | null | string,
    live_event_banner:string | null,
    talkshow_event_banner:string | null,
    read_out_language_id: number | null | string,
    read_out_language: string | null,
    read_out_accent_id?:number | null,
    read_out_accent_name?:string|null
    opt_in?:number
}

export interface TempuserProps  {
    user_id: number;
    email: string;
    name: string;
    profile_image: string | null;
    user_status_type: number;

  }

export type AuthData = {
    isLoading: boolean;
    isSuccess: boolean;
    loginUserData: loginUserDataProps | null;
    loginToken: string | null;
    userSettings: loginUserSettingsProps | null;
    isAccountActive: boolean;
    eventTempUserData: TempuserProps | null;
    reference_id:string|null
  };

