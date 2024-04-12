import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const TodoCard = ({ id, description, done, onDelete, onToggleDone, onUpdateDescription }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState(description);

    const handleToggleDone = () => {
        onToggleDone(id);
    };

    const handleUpdateDescription = () => {
        onUpdateDescription(id, editedDescription, isEditing);
        setIsEditing(false);
    };

    return (
        <View style={styles.todo}>
            {isEditing ? (
                <TextInput
                    style={[styles.input, styles.todoText]}
                    value={editedDescription}
                    onChangeText={setEditedDescription}
                    onBlur={handleUpdateDescription}
                    autoFocus
                />
            ) : (
                <Text style={[styles.todoText, done && styles.doneText]} onPress={handleToggleDone}>
                    {description}
                </Text>
            )}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    todo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    todoText: {
        flex: 1,
        fontSize: 16,
    },
    doneText: {
        textDecorationLine: 'line-through',
        color: 'gray',
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    editButton: {
        padding: 5,
        backgroundColor: '#3498db',
        borderRadius: 5,
        marginRight: 5,
    },
    editButtonText: {
        color: 'white',
    },
    deleteButton: {
        padding: 5,
        backgroundColor: '#e74c3c',
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
    },
});

export default TodoCard;
