import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button
} from "@mui/material";

const DeleteModal = ({ open, onClose, handleDelete,title }: { open: boolean; onClose: () => void, handleDelete: ()=>void, title: string }) => {

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                   <h1>Are you sure you want to delete?</h1>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: "red" }} onClick={handleDelete}>
                        Yes
                    </Button>
                </DialogActions>
        </Dialog>
    );
};

export default DeleteModal;
