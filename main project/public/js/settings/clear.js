export const deleteAllData = async (delTcategory) => {
    // Show confirmation prompt
    const confirmation = confirm(`Are you sure you want to delete all Data? This action cannot be undone.`);
    if (!confirmation) return; // Exit if the user cancels the action

    try {
        // Send a DELETE request to the server
        const response = await fetch(`/api/clearAll/Transactions/data/All`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete transactions');
        }

        // Show success alert
        alert(`All Data Have Been Successfully Clear.`);
        
        // Reload the page
        window.location.reload();
    } catch (error) {
        // Log the error and alert the user
        console.error('Error deleting transactions:', error);
        alert('An error occurred while deleting transactions. Please try again.');
    }
};