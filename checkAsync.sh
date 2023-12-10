#!/bin/bash
rep="./data/server/src/"
ignore_file=".checkAsyncIgnore"
clear

stringContain() { case $2 in *$1* ) return 0;; *) return 1;; esac ;}

find_function_usage()
{
	func_name="$1"

	origin_nl=$(echo "$2" | awk -F':' '{print $2}')
	#echo -e "\x1B[32m :$origin_nl \x1B[0m";
	echo

	#echo -e ">>> ${3#* }";


	find $rep -name "*.ts" -exec grep -nH "$func_name(" {} + \
	| grep -Ev "async"  \
	| while read -r line; do

    	m1=$(echo "$line" | awk '{print $1}')
		m1=${m1##*/}
    	m2="${line#* }"

    	mp=$(echo "$line" | awk '{print $1}')
		if [[ $mp == *"//" ]]; then
			continue
		fi

		while [ ${#m1} -lt 32 ]; do
    		m1="$m1 "
		done


		cont=0
		lnreal=$(echo "$m2" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
		while IFS= read -r ligne; do
			lnfile=$(echo "$ligne" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

    		if [ "$lnreal" == "$lnfile" ]; then
				cont=1
			fi

			if stringContain "$lnfile" "$lnreal"; then
				cont=1
    		fi

			if [[ $cont -eq 1 ]]; then
				echo -en "[\x1B[33mIGNORE\x1B[0m]";
				#echo "$m1 $m2"
				echo " $m1 $lnreal"
				break
			fi

		done < "$ignore_file"
		if [[ $cont -eq 1 ]]; then
			continue
		fi

		if [[ "$line" == *"await "* ]]; then
			echo -en "[ \x1B[32m OK \x1B[0m ]";
			#echo " $m1 $m2"
			echo " $m1 $lnreal"
		else
			echo -en "[ \x1B[31m KO \x1B[0m ]";
			#echo " $m1 $m2"
			echo " $m1 $lnreal"
		fi

	done

}

find $rep -name "*.ts" -exec grep -nH "async" {} + \
| while read -r ln; do
    w1=$(echo "$ln" | awk '{print $1}')
	w1=${w1##*/}

	tff=$w1
		while [ ${#tff} -lt 32 ]; do
    		tff="$tff "
		done
	echo -en "\x1B[36m$tff \x1B[0m";

    w2=$(echo "$ln" | awk '{print $2}')
    w3=$(echo "$ln" | awk '{print $3}')
    w4=$(echo "$ln" | awk '{print $4}')



	if [[ "$w2" == "async" ]]; then
		echo -en "\x1B[35m $w2 \x1B[0m";
		av="${w3%%(*}"
		if [ "$av" == "$w3" ]; then

			#fi
			echo -en "\x1B[31m '(' not found \x1B[0m";
			echo -en "\x1B[36m $w3 \x1B[0m";
			echo -en "\x1B[37m $w4 \x1B[0m";
			echo

		else
			#valid
			echo -en "\x1B[36m $av() \x1B[0m";
			find_function_usage "$av" "$w1" "$ln"
		fi
	else
		fun="${w4%%(*}"
		#echo "fun: $fun"
		if [ "$fun" == "$w4" ]; then
			echo -en "\x1B[31m Error format, requiring manual checking \x1B[0m";
			echo -en "\x1B[36m $w3 \x1B[0m";
			echo -en "\x1B[37m $w4 \x1B[0m";
			echo
		else
			#valid
			echo -en "\x1B[35m $w3 \x1B[0m";
			echo -en "\x1B[36m $fun() \x1B[0m";
			find_function_usage "$fun" "$w1" "$ln"
		fi
	fi
	#echo
done
