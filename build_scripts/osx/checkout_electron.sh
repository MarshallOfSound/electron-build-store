cd electron

commit=$(`git rev-list --tags --max-count=1`)

git checkout $commit

cd ..
