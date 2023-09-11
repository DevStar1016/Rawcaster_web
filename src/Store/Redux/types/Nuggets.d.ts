type SharedDetailsListProp = {
    name: string;
    img: string;
  };
  
  type PollOptionProp = {
    option_id: number;
    option_name: string;
    option_percentage: number;
    votes: number;
  };
  
  type MediaDataProp =  {
    media_id: number;
    media_type: 'video' | 'audio' | 'image';
    media_file_type: string;
    path: string;
  }

  type MetadataProps = {
    title:string,
    description:string,
    image:string
  }
  
  type NuggetDataProp = {
    nugget_id: number;
    content: string;
    metadata: MetadataProps | null;
    created_date: string;
    user_id: number;
    user_ref_id: string;
    account_verify_type: number;
    type: number;
    original_user_id: number;
    original_user_name: string;
    original_user_image: string;
    user_name: string;
    user_image: string;
    user_status_id: number;
    liked: false;
    viewed: number;
    following: true;
    follow_count: number;
    total_likes: number;
    total_comments: number;
    total_views: number;
    total_media: number;
    share_type: number;
    media_list: MediaDataProp[];
    is_nugget_owner: number;
    is_master_nugget_owner: number;
    shared_detail: SharedDetailsListProp[];
    shared_with: any[];
    is_downloadable: number;
    poll_option: PollOptionProp[];
    poll_duration: string;
    voted: number;
    voted_option: any | null;
    total_vote: number;
    saved: boolean;
    readout_url?:string | null,
    translate_text?:string | null
  };

  export interface NuggetReducerProps {
    token: string | null,
    nuggetVideoPaused: boolean,
    nuggetFormData: any,
    Nuggets: NuggetDataProp[],
    isNuggetsLoading: boolean,
    isNuggetMuted: boolean,
    DashboardfilterType: number,
    currentpage: number,
    totalpages: number,
    totalNuggets: number,
    isNextPageLoading: boolean,
  }