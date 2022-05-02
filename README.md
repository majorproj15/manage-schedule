main	main drives the program                                        1) Calculate the holidays.                                       2) Calculate special SSA days.                                 3) Create PEMEMO.                                                4) Create the calenders.
	
	
	
	
get_changes	Read the "calender_mod.txt" file for modifications to the last day of COMM or additional holidays. In the file , if the first character is a # then it is a comment. The acceptable changes are LDC for the Last day of COMM and HOL for an additional holiday.
	
	
	
	
compare_special_days	The Compare jobs function is used by the llsort function . This determines how the fields are sorted. In this case it is sorted by application and job_name.
get_new_yrs	New Years Day is a federal holiday if it is Monday to Friday. If it is falls on a Saturday then the preceding Friday is taken and if it falls on Sunday then the following Monday is taken:
get_next_new_yrs	New Years Day is federal holiday if it is is Monday to Friday. If it falls on a Saturday then the prceding Friday is taken and if it falls on Sunday then the following Monday is taken. Next new years day may be December 31.
get_ml_king	Martin Luther King Birthday is celebrated on the third Monday of January.
get_president_day	President's day is celebrated on the third Monday of February.
get_memorial_day	Memorial Day is celebrated on the last Monday of May.
get_july4	Independennce Day is a federal holiday if it is Monday to Friday. If it falls on a Saturday then the preceding Friday is taken and if it falls on Sunday then the following Monday is taken.
get_labor_day	Labor Day is celebrated on the first Monday of september.
get_columbus_day	Columbus Day is celebrated on the second Monday of October.
get_veterans_day	veternas Day is federal Holiday if it is Monday to Friday .If it is falls on Saturday then the preceding Friday is taken and if it falls on Sunday then the following Monday is taken.
get_thanks	Thanksgiving Day is celebrated on the forth Thursday of November.
get_christ	Christmas Day is federal Holiday if it Monday to Friday(December 25). If It falls on a Saturday then the prcending Friday is taken and if it falls on Sunday then the following Monday is taken.
is_workday	Is this a workday? Workdays are Monday through Friday and not Federal Holidays.
find_workday	find the first workday on or before the given date.
find_day_before	find the day before the given date. It does not need to be a workday. If the day is the first of the month then go the preceding month. If the day is the first day of the year then go to the prcending year.
find_next_workday	find the first workday on or after the given date.
get_worday_before	find the workday a number of days before a given date.
get_worday_after	find the workday a number of days after a given date.
get_check_delivery	check delivery day is the first workday on or before the third calender day of the month.
get_last_day_of_comm	The day of comm(Last day of current operating month) is six workdays before the check delivery day(CDD) with the following exceptations In March and october , if LDC does not fall Monday the move LDC to the the previos Monday if this is AERO wek.  AERO is the last Friday of March and October. In November (if BRI is scheduled), if LDC does not fall on friday then move LDC to Previos Friday. Changed November to Friday before THanksgiving In december , Seven workdays Before CDD. If any month (if MBR REWRITE is sceduled) , if LDC does not fall on friday then monve LDC to the previos Friday.
get_first_day_of_comm	the first day of comm FDC(First day of current operating Month) is the first workday after the last day of comm.
get_aero	AERO Is the last Friday of March and October.
get_final_cutoff	The pe final cuttoff is 16 work days before the check delivery date. It is changed to one day before the last day of COM starting with the whole file certification.
get_mbr_update	the MBR update and RTTUTR creation is 15 work days before the check delivery date. With whole file certification it is moved toh the last day of COMM
get_totals2rfc	The RTTUTR and balance totals to RFC is 14 work days before the check delivery date.
get_bri	BRI(Benefit Rate Increase) is the Friday before Thanksgiving.
get_ssi_cert	The SSI Certification to RDC is the first workday after thrid Saturday of the month. THE SSI supplemental certification to RDC is the second Monday or following workday after the thrid Saturday of the Month. Supplemental does not run in december. The SSI Check Delivery to the Public(SSICDD) is the last worday on or befor the first of the month.
![image](https://user-images.githubusercontent.com/29110312/154598256-9b30b604-8cc6-49c4-a8dc-2979db080e2a.png)
