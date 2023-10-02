import os
import subprocess

# Create an empty dictionary to store commit hashes and project sizes
commit_sizes = {}

# Get a list of all commit hashes in the Git history in reverse order (from HEAD to the first commit)
commit_hashes = subprocess.check_output(["git", "rev-list", "--reverse", "HEAD"]).decode().splitlines()

# Iterate through the commit hashes
for commit_hash in commit_hashes:
    # Check out the specific commit
    subprocess.call(["git", "checkout", commit_hash])
    
    # Calculate the size of the project directory
    project_size = sum(os.path.getsize(f) for f in os.listdir('.') if os.path.isfile(f))
    
    # Store the commit hash and project size in the dictionary
    commit_sizes[commit_hash] = project_size

# Print all the results after processing all commits
for commit_hash, project_size in commit_sizes.items():
    print(f"Commit: {commit_hash}, Project Size: {project_size} bytes")

# Now, you have a dictionary containing commit hashes and project sizes
# You can save this data to a file or visualize it as needed.
