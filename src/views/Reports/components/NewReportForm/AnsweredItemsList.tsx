// AnsweredItemsList.tsx
import React from 'react';
import { Box, Typography, Collapse, IconButton, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AnsweredItemsListProps {
    answeredItems: { partIndex: number; itemIndex: number; item: any }[];
    showAnsweredItems: boolean;
    setShowAnsweredItems: React.Dispatch<React.SetStateAction<boolean>>;
    handleEditAnsweredItem: (partIndex: number, itemIndex: number) => void;
}

const AnsweredItemsList: React.FC<AnsweredItemsListProps> = ({
                                                                 answeredItems,
                                                                 showAnsweredItems,
                                                                 setShowAnsweredItems,
                                                                 handleEditAnsweredItem,
                                                             }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
                onClick={() => setShowAnsweredItems((prev) => !prev)}
            >
                <Typography variant="h6">Answered Items</Typography>
                <IconButton>
                    <ExpandMoreIcon
                        sx={{
                            transform: showAnsweredItems ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                        }}
                    />
                </IconButton>
            </Box>

            <Collapse in={showAnsweredItems} timeout="auto" unmountOnExit>
                {answeredItems.length === 0 ? (
                    <Typography variant="body1">No answered items yet.</Typography>
                ) : (
                    answeredItems.map(({ partIndex, itemIndex, item }) => (
                        <Box
                            key={`answered-${partIndex}-${itemIndex}`}
                            sx={{
                                p: 1,
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                mb: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="body2">
                                {`שאלה ${item.questionNumber} - ${item.name} | Answer: ${
                                    typeof item.value === 'object'
                                        ? JSON.stringify(item.value)
                                        : item.value
                                }`}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleEditAnsweredItem(partIndex, itemIndex)}
                            >
                                Edit
                            </Button>
                        </Box>
                    ))
                )}
            </Collapse>
        </Box>
    );
};

export default AnsweredItemsList;
