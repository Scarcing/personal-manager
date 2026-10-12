package com.rafi.daybook;
import android.content.*;
public class RestoreReceiver extends BroadcastReceiver {@Override public void onReceive(Context c,Intent i){String a=i.getAction();if(Intent.ACTION_BOOT_COMPLETED.equals(a)||Intent.ACTION_TIME_CHANGED.equals(a)||Intent.ACTION_TIMEZONE_CHANGED.equals(a)||"android.app.action.SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED".equals(a))Reminders.restore(c);}}
