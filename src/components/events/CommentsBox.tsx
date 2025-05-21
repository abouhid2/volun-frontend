import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Paper, Avatar } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import type { Comment } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../hooks/useAuth';
import { translations } from '../../translations/pt';

interface CommentsBoxProps {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onUpdateComment: (commentId: number, content: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

export const CommentsBox: React.FC<CommentsBoxProps> = ({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await onAddComment(newComment);
    setNewComment('');
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !editContent.trim()) return;
    await onUpdateComment(editingComment.id, editContent);
    setEditingComment(null);
    setEditContent('');
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={translations.events.comments.addPlaceholder}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={!newComment.trim()}
          sx={{ mb: 3 }}
        >
          Comentar
        </Button>
      </form>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {comments.map((comment) => {
          const typedComment = comment as Comment;
          return (
            <Paper key={typedComment.id} sx={{ p: 2 }}>
              {editingComment?.id === typedComment.id ? (
                <form onSubmit={handleUpdate}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!editContent.trim()}
                    >
                      Salvar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </form>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 1 }}>
                      {typedComment.user?.name ? (
                        typedComment.user.name.charAt(0).toUpperCase()
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                    <Typography variant="subtitle2">{typedComment.user?.name}</Typography>
                    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                      {format(new Date(typedComment.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
                      {typedComment.user_id === user?.id && (
                        <IconButton size="small" onClick={() => handleEdit(typedComment)}>
                          <EditIcon fontSize="small" />
                      </IconButton>
                      )}
                      {typedComment.user_id === user?.id && (
                        <IconButton size="small" onClick={() => onDeleteComment(typedComment.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body1">{typedComment.content}</Typography>
                </>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}; 