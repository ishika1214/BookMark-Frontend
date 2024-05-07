import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  Input,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { wrap } from "module";
import React, { ChangeEvent, useEffect, useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "sonner";
import UserDetails from "./UserDetails";

interface IUserData {
  createdAt: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  updatedAt: string;
}

interface Ibookmark {
  id?: string;
  title: string;
  description?: string;
  link: string;
  files?: File;
}

interface IbookmarkList {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  link: string;
  userId: number;
  files?: File;
}

const Dashboard = () => {
  //stores accessToken
  const [accessToken, setAccessToken] = useState<string>();

  //stores userData
  const [userData, setUserData] = useState<IUserData>();

  //handle bookmark modal openClose
  const [open, setOpen] = useState<boolean>(false);

  //handles check edit
  const [isEditBookmark, setIsEditBookmark] = useState<boolean>(false);

  //stores current bookmark
  const [bookmark, setBookmark] = useState<Ibookmark>({
    title: "",
    link: "",
  });

  //stores bookmark list
  const [bookmarkList, setBookmarkList] = useState<IbookmarkList[]>([]);

  //Fetches user Data
  const getUserData = async (token: string) => {
    const { data } = await axios.get("http://localhost:3333/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data) {
      setUserData(data);
    }
    console.log(data, "usersData");
  };

  //create bookmark
  const createBookmark = async () => {
    try {
      const formdata = new FormData();
      
      // Check if bookmark.files exists before appending
      if (bookmark.files) {
        formdata.append('files', bookmark.files);
      }
  
      // Append other fields to FormData if needed
      formdata.append('title', bookmark.title);
      formdata.append('link', bookmark.link);
      formdata.append('description', bookmark.description || '');
  
      const { data } = await axios.post(
        "http://localhost:3333/bookmarks",
        formdata,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (accessToken) getAllBookmarks(accessToken);
      setOpen(false);
      toast.success("Bookmark created successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  //fetches all bookmarks
  const getAllBookmarks = async (token: string) => {

    const { data } = await axios.get("http://localhost:3333/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookmarkList(data);
  };

  //edits bookmarks
  const handleEditBookmark = async (id: string) => {
    try {
      const { data } = await axios.patch(
        "http://localhost:3333/bookmarks/" + id,
        bookmark,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (data) {
        getAllBookmarks(accessToken as string);
      }

      setOpen(false);
      setIsEditBookmark(false);
      toast.success("Bookmark updated successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  //fetches bookmark by Id
  const getBookmarkById = async (id: number) => {
    const { data } = await axios.get("http://localhost:3333/bookmarks/" + id, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (data) {
      setBookmark(data);
    }
  };

  //Delete bookmark by ID
  const deleteBookmark = async (id: number) => {
    try {
      const { data } = await axios.delete(
        "http://localhost:3333/bookmarks/" + id,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      getAllBookmarks(accessToken as string);
      toast.success("Bookmark deleted successfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  //sort Data
  const sortData = () => {};
  useEffect(() => {
    const data = localStorage.getItem("accessToken");
    console.log(data);
    if (data) {
      setAccessToken(() => data);
      getUserData(data as string);
      getAllBookmarks(data);
    }
  }, []);

  const [openDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsOpenDrawer(open);
    };
    const onChangess = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const file = (e.target as HTMLInputElement).files;
 
      if (file) {
        console.log(file[0],"file")
        setBookmark({...bookmark,files:file[0]})
      }
    };

  return (
    <>
      <Box
        sx={{
          fontFamily: "sans-serif",
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
          width: "100%",
          maxWidth: "98%",
          padding: "1rem",
          backgroundColor: "#ffffff",
          " @media(max-width:991px)": { padding: "0.5rem" },
          " @media(max-width:479px)": { padding: "0.5rem" },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            " @media(max-width:991px)": { fontSize: "18px" },
            " @media(max-width:479px)": { fontSize: "16px" },
          }}
        >
          Welcome {userData?.firstName} {userData?.lastName}
        </Typography>
        <Divider
          sx={{ height: "1px" }}
          color="#9ca3af"
          style={{ width: "100%" }}
        ></Divider>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create Bookmark
        </Button>
        <Button onClick={toggleDrawer("left", true)}>drwer</Button>
        <Drawer
          anchor={"left"}
          open={openDrawer}
          onClose={toggleDrawer("left", false)}
        >
          <UserDetails toggleDrawer={toggleDrawer} />
        </Drawer>
        <Grid container spacing={2} sx={{ margin: "5px" }} width={"100%"}>
          {bookmarkList !== null &&
            bookmarkList.map((item) => (
              <Grid xs={3}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#ffbf00",
                    color: "white",
                    border: "1px solid rgba(36, 28, 21, 0.15)",
                    height: "146px",
                    padding: "16px",
                    margin: "10px",
                  }}
                >
                  <Stack
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    spacing="0px"
                    direction="row"
                  >
                    <BorderColorIcon
                      onClick={() => {
                        if (item.id) {
                          getBookmarkById(item.id);
                          setIsEditBookmark(true);
                          setOpen(true);
                        }
                      }}
                    />
                    <DeleteIcon onClick={() => deleteBookmark(item.id)} />
                  </Stack>
                  <Typography
                    variant="h4"
                    sx={{
                      " @media(max-width:991px)": { fontSize: "14px" },
                      " @media(max-width:479px)": { fontSize: "14px" },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      " @media(max-width:991px)": { fontSize: "14px" },
                      " @media(max-width:479px)": { fontSize: "14px" },
                    }}
                  >
                    {item?.description}
                  </Typography>
                  <a href={`${item.link}`} target="#">
                    {"your bookmark link"}
                  </a>
                </Card>
              </Grid>
            ))}
        </Grid>
        <Dialog open={open}>
          <DialogTitle>
            <Typography variant="h4"> Create new bookmark</Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              required
              fullWidth
              name="title"
              label="title"
              type="title"
              id="title"
              autoComplete="current-title"
              value={bookmark.title}
              onChange={(e) =>
                setBookmark({ ...bookmark, title: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="description"
              type="description"
              id="description"
              autoComplete="current-description"
              value={bookmark.description}
              onChange={(e) =>
                setBookmark({ ...bookmark, description: e.target.value })
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="link"
              label="link"
              type="link"
              id="link"
              autoComplete="current-link"
              value={bookmark.link}
              onChange={(e) =>
                setBookmark({ ...bookmark, link: e.target.value })
              }
            />
            <Button variant="outlined" component="label">
              <Input
                type="file"
                onChange={(e)=>onChangess(e)}
                hidden
              />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (isEditBookmark) {
                  if (bookmark.id) handleEditBookmark(bookmark.id);
                  setBookmark({ title: "", description: "", link: "" });
                } else {
                  createBookmark();
                  setBookmark({ title: "", description: "", link: "" });
                }
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                setIsEditBookmark(false);
                setBookmark({ title: "", description: "", link: "" });
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Dashboard;
