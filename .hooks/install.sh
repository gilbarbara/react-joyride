#!/usr/bin/env sh

puts() { printf %s\\n "$*" ;}

hook_dir=$(git rev-parse --show-toplevel)"/.git/hooks"
tracked_dir=$(git rev-parse --show-toplevel)"/.hooks"
requested_hook="$1"

default_hooks="applypatch-msg pre-applypatch post-applypatch pre-commit prepare-commit-msg commit-msg post-commit pre-rebase post-checkout post-merge pre-receive update post-receive post-update pre-auto-gc"

if [ ! -d "$hook_dir" ]; then
	puts 'You must be in the root directory of a `git` project to use this script!' >&2
	exit 1
fi

install_hook() {
	hook_name="$1"
	if [[ -f "$tracked_dir/$hook_name" && ! -h $hook_dir/$hook_name ]]; then
		puts "Installing '$hook_name' hook ..." >&2

		if [ ! -h $hook_dir/$hook_name -a -x $hook_dir/$hook_name ]; then
			puts "Moving original '$hook_name' to '$hook_name.local' ..." >&2
			mv $hook_dir/$hook_name $hook_dir/$hook_name.local
		fi

		ln -s -f "../../.hooks/$hook_name" "$hook_dir" || exit 1
	fi
}

if [[ $default_hooks =~ "$requested_hook" ]]; then
	install_hook $requested_hook
else
	for default_hook in $default_hooks; do
		install_hook $default_hook;
	done
fi