
export enum Constants {
    POSTS_SUSCRIBE_NOT_ALLOWED = "You are not allowed to suscribe to this post",
    POSTS_SUSCRIBE_ALREADY_SUSCRIBED = "You are already suscribed to this post",
    POSTS_UNSUSCRIBE_ALREADY_UNSUSCRIBED = "You are already not suscribed to this post",
    POSTS_UNSUSCRIBE_OK = "You have been unsuscribed to this post",
    POSTS_UNSUSCRIBE_ERROR = "An error ocurred, please try later",
    POSTS_UNSUSCRIBE_NOT_ALLOWED = "You are not allowed to unsuscribe or suscribe to this post",
    POSTS_NOT_FOUND = "Post not found",
    POSTS_CREATE_NOT_ALLOWED = 'Not allowed to create posts, only entrepreneours can create posts',
    POSTS_EDIT_NOT_ALLOWED = "Only the post owner can update this post, not active posts cannot be edit",
    POSTS_DELETE_NOT_ALLOWED = "Only the post owner can delete this post, not active posts can't be deleted",
    POSTS_CHOOSE_NOT_ALLOWED = "Only the post owner can choose candidates of the post, not active posts can't do the selection of candidates process",
    POSTS_CHOOSE_INVALID_USERS = "You didnt select any valid user to candidate, make sure that the users you select are suscribed",
    GENRES_INVALID = "Some of the genres requested does not exist",
    USER_NOT_FOUND = "User not found",
    GENERAL_ERROR = "Something went wrong, please try later",
    BAD_REQUEST = "Invalid data, please ensure that you are sending the requested data correctly"
}