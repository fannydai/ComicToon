package com.example.ComicToon.Models.RequestResponseModels;

public class DeleteReportForm {
    private String type; // type of report you're gonna do (user, comic, series, comment)
    private String reportedID;
    private String reportingID;

    /**
     * @return the reportedID
     */
    public String getReportedID() {
        return reportedID;
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * @return the reportingID
     */
    public String getReportingID() {
        return reportingID;
    }

    /**
     * @param reportingID the reportingID to set
     */
    public void setReportingID(String reportingID) {
        this.reportingID = reportingID;
    }

    /**
     * @param reportedID the reportedID to set
     */
    public void setReportedID(String reportedID) {
        this.reportedID = reportedID;
    }

   
}