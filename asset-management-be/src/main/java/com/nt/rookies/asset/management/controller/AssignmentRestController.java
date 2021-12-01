package com.nt.rookies.asset.management.controller;

import com.nt.rookies.asset.management.dto.AssignmentDTO;
import com.nt.rookies.asset.management.service.AssignmentService;
import java.sql.SQLException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST controller for Assignment. */
@RestController
@RequestMapping("/api/v1.0")
public class AssignmentRestController {
  private final AssignmentService assignmentService;

  @Autowired
  public AssignmentRestController(AssignmentService assignmentService) {
    this.assignmentService = assignmentService;
  }

  /**
   * API Get all assignments by current admin location <br>
   * Link: <code>/api/v1.0/assignments</code> <br>
   * Method: GET
   *
   * @return {@link List<AssignmentDTO>}
   */
  @GetMapping()
  public List<AssignmentDTO> getAllAssignments() {
    return assignmentService.getAllAssignmentsByLocation();
  }

  /**
   * API Get assignment by id. <br>
   * Link: <code>/api/v1.0/assignments/{id}</code> <br>
   * Method: GET
   *
   * @param id assignment id
   * @return {@link AssignmentDTO} object if found
   */
  @GetMapping("/user/assignments/{id}")
  public AssignmentDTO getAssignmentById(@PathVariable("id") Integer id) {
    return assignmentService.getAssignmentById(id);
  }

  /**
   * API Create assignment
   *
   * @param assignmentDTO
   * @return
   * @throws SQLException
   */
  @PostMapping("/admin/assignments")
  public AssignmentDTO createAssignment(@RequestBody AssignmentDTO assignmentDTO)
      throws SQLException {
    return assignmentService.createAssignment(assignmentDTO);
  }

  /**
   * API Get all recent assignments assigned to user.<br>
   * Link: <code>/api/v1.0/assignments/user</code><br>
   * Method: GET
   *
   * @return {@link List <AssignmentDTO>} list of assignments
   */
  @GetMapping("/user/assignments")
  public List<AssignmentDTO> getRecentAssignmentsByUser() {
    return assignmentService.getRecentAssignmentsByUser();
  }
}
