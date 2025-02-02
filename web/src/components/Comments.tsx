// 评论区组件

import { Avatar, Box, Button, Card, Divider, Grid2, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "@/utils/axios.ts";
import { Comment } from "@/models/comment.ts";
import useAuthStore from "@/stores/auth.ts";

// interface MyCommentProps {
//     comment?: string;
//     firstName?: string;
//     created_at?: number;
//     deleteComment:(id:number) => void;
//     id:number;
// }

function MyComment({ comment, firstName, created_at, deleteComment, id}: {
    comment?: string; firstName?: string; created_at?: number; deleteComment:(id:number) => void; id:number;
}) {
    const date = new Date(Number(created_at) * 1000);
    return (
        <>
            <Grid2 container sx={{ backgroundColor: "#f0f0f02d" }}>
                <Grid2 display="flex" sx={{ margin: 2 }}>
                    <Avatar sx={{ marginRight: 4, alignContent: "center" }}>
                        {firstName?.slice(0, 4)}
                    </Avatar>
                    <Box>
                        {comment ? (
                            <Typography variant="body1">{comment}</Typography>
                        ) : (<Typography variant="body2" fontStyle="italic">...</Typography>)}
                        <Typography variant="caption">{date.toLocaleString()}</Typography>
                    </Box>
                    <Button variant="contained" color="error" onClick={() => deleteComment(id)}>删除</Button>
                </Grid2>
            </Grid2>
        </>
    );
}

export default function Comments({ id }: { id: number }) {

    const [comments, setComments] = useState<Array<Comment>>();
    const [commentSend, setCommentSend] = useState<string>();
    const authStore = useAuthStore();

    function fetchComments() {
        api().get(`/articles/${id}/comments`).then(
            (res) => {
                const r = res.data;
                setComments(r.data);
            },
        );
    }

    useEffect(() => {
        fetchComments();
    }, []);

    function submitComment() {
        api().post("/comments", {
            article_id: id,
            content: commentSend,
            user_id: authStore?.user?.id,
        }).then(() => {
            fetchComments();
            setCommentSend("");
        });
    }

    function deleteComment(id: number) {
        api().delete(`/comments/${id}`).then(() => {
            fetchComments();
        });
    }

    return (
        <>
            <Divider>评论区</Divider>
            <Card sx={{ marginTop: 3 }}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "1rem 0",
                    gap: "1rem",
                }}>
                    <TextField
                        maxRows="20"
                        minRows="2"
                        multiline
                        fullWidth
                        value={commentSend}
                        onChange={(e) => setCommentSend(e.target.value)}
                    />
                    <Button variant="contained" onClick={submitComment}>评论</Button>
                </Box>
                <Grid2>
                    {comments?.map((oneComments, index) => {
                        return (
                            <MyComment
                                key={index}
                                comment={oneComments.content}
                                firstName={oneComments.user?.username}
                                created_at={oneComments.created_at}
                                deleteComment={deleteComment}
                                id={oneComments.id}
                            />
                        );
                            // <Button variant="contained" onClick={deleteComment(MyComment, id)}>删除</Button>
                    })}
                </Grid2>
            </Card>
        </>
    );
}
